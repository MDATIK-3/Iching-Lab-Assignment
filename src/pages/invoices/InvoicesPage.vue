<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h4 q-mb-xs">Invoices</div>
        <div class="text-subtitle1 text-grey-6">Paid orders history</div>
      </div>
      <q-space />
      <q-input v-model="search" outlined dense placeholder="Search invoices..." style="max-width: 320px" />
    </div>

    <q-card>
      <q-list separator>
        <q-item v-for="o in filtered" :key="o.id" clickable @click="selected = o">
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ o.customerName || 'Walk-in' }}
              <span v-if="o.tableNumber" class="text-grey-6">• Table {{ o.tableNumber }}</span>
            </q-item-label>
            <q-item-label caption>
              Paid: {{ new Date(o.paidAt || o.createdAt).toLocaleString() }} • {{ o.items.length }} item(s)
            </q-item-label>
          </q-item-section>
          <q-item-section side class="text-weight-medium">
            {{ money(o.total) }}
          </q-item-section>
        </q-item>

        <q-item v-if="filtered.length === 0">
          <q-item-section class="text-grey-6">No invoices yet. Mark an order as paid in Orders.</q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-dialog v-model="detailsOpen">
      <q-card style="min-width: 520px; max-width: 90vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Invoice Details</div>
          <q-space />
          <q-btn
            v-if="selected"
            flat
            icon="download"
            label="PDF"
            class="q-mr-sm"
            @click="downloadPdf(selected)"
          />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section v-if="selected">
          <div class="text-body2 text-grey-7 q-mb-sm">Invoice #{{ selected.id }}</div>
          <div class="q-mb-sm">
            <div class="text-subtitle2">Customer</div>
            <div>{{ selected.customerName || 'Walk-in' }}</div>
          </div>
          <div class="q-mb-sm" v-if="selected.tableNumber">
            <div class="text-subtitle2">Table</div>
            <div>{{ selected.tableNumber }}</div>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle2">Paid at</div>
            <div>{{ new Date(selected.paidAt || selected.createdAt).toLocaleString() }}</div>
          </div>

          <q-list bordered separator class="q-mb-md">
            <q-item v-for="it in selected.items" :key="it.itemId">
              <q-item-section>
                <q-item-label>{{ it.name }}</q-item-label>
                <q-item-label caption>{{ it.qty }} × {{ money(it.price) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ money(it.price * it.qty) }}
              </q-item-section>
            </q-item>
          </q-list>

          <div class="row items-center">
            <div class="text-subtitle1 text-weight-medium">Total</div>
            <q-space />
            <div class="text-subtitle1 text-weight-medium">{{ money(selected.total) }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useOrderStore } from 'src/stores/orderStore'
import { jsPDF } from 'jspdf'

const orderStore = useOrderStore()
const search = ref('')
const selected = ref(null)
const detailsOpen = ref(false)

watch(selected, (v) => {
  detailsOpen.value = !!v
})
watch(detailsOpen, (open) => {
  if (!open) selected.value = null
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = orderStore.paidOrders || []
  if (!q) return list
  return list.filter((o) => {
    return (
      o.id?.toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      String(o.tableNumber || '').toLowerCase().includes(q)
    )
  })
})

const money = (n) =>
  new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(
    Number(n) || 0,
  )

// jsPDF built-in fonts don't support Bengali/Unicode well.
// Use an ASCII-safe format for PDFs to avoid garbled output.
const moneyPdf = (n) => {
  const amount = Number(n) || 0
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `BDT ${formatted}`
}

const downloadPdf = (invoice) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let y = 52

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Invoice', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  y += 22
  doc.text(`Invoice #: ${invoice.id}`, margin, y)
  y += 16
  doc.text(`Customer: ${invoice.customerName || 'Walk-in'}`, margin, y)
  y += 16
  if (invoice.tableNumber) {
    doc.text(`Table: ${invoice.tableNumber}`, margin, y)
    y += 16
  }
  doc.text(`Paid at: ${new Date(invoice.paidAt || invoice.createdAt).toLocaleString()}`, margin, y)

  y += 22
  doc.setDrawColor(200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 18

  doc.setFont('helvetica', 'bold')
  doc.text('Item', margin, y)
  doc.text('Qty', pageWidth - margin - 120, y, { align: 'right' })
  doc.text('Amount', pageWidth - margin, y, { align: 'right' })

  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setDrawColor(230)
  doc.line(margin, y, pageWidth - margin, y)
  y += 18

  const items = Array.isArray(invoice.items) ? invoice.items : []
  items.forEach((it) => {
    const lineAmount = (Number(it.price) || 0) * (Number(it.qty) || 0)
    const leftText = `${it.name || ''} (${moneyPdf(it.price)})`

    doc.text(leftText, margin, y, { maxWidth: pageWidth - margin * 2 - 160 })
    doc.text(String(it.qty ?? ''), pageWidth - margin - 120, y, { align: 'right' })
    doc.text(moneyPdf(lineAmount), pageWidth - margin, y, { align: 'right' })

    y += 18
    if (y > doc.internal.pageSize.getHeight() - 90) {
      doc.addPage()
      y = 52
    }
  })

  y += 10
  doc.setDrawColor(200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 20

  doc.setFont('helvetica', 'bold')
  doc.text('Total', pageWidth - margin - 120, y, { align: 'right' })
  doc.text(moneyPdf(invoice.total), pageWidth - margin, y, { align: 'right' })

  const filenameSafeId = String(invoice.id || 'invoice').replace(/[^\w-]+/g, '_')
  doc.save(`invoice_${filenameSafeId}.pdf`)
}
</script>

