<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h4 q-mb-xs">Invoices</div>
      </div>
      <q-space />
      <q-input v-model="search" outlined dense placeholder="Search invoices..." style="max-width: 320px" />
    </div>

    <q-card>
      <q-list separator>
        <q-item v-for="o in filteredOrders" :key="o.id" clickable @click="selected = o">
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ o.customerName || 'Walk-in' }}
              <span v-if="o.phoneNumber"> • {{ o.phoneNumber }}</span>
              <span v-if="o.tableNumber"> • Table {{ o.tableNumber }}</span>
              <span v-if="o.seatNumber"> • Seat {{ o.seatNumber }}</span>
            </q-item-label>
            <q-item-label caption>
              {{ o.status === 'open' ? 'Created' : 'Paid' }}: {{ formatDate(o) }} • {{ o.items.length }} item(s)
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="q-gutter-xs">
              <q-btn flat icon="visibility" label="View" size="sm" @click.stop="viewInvoice(o)" />
              <q-btn flat icon="download" label="Download" size="sm" @click.stop="downloadPdf(o)" />
              <q-btn flat icon="print" label="Print" size="sm" @click.stop="printInvoice(o)" />
            </div>
          </q-item-section>
        </q-item>
        <q-item v-if="filteredOrders.length === 0">
          <q-item-section class="text-grey-6">No orders yet.</q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-dialog v-model="detailsOpen">
      <q-card style="min-width: 520px; max-width: 90vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Invoice #{{ selected?.id }}</div>
          <q-space />
          <q-btn flat icon="download" label="Download PDF" @click="downloadPdf(selected)" />
          <q-btn flat icon="print" label="Print" @click="printInvoice(selected)" class="q-ml-sm" />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="selected">
          <div class="text-body2 text-grey-7 q-mb-sm">Order {{ selected.status === 'open' ? 'Draft' : 'Invoice' }} #{{
            selected.id }}</div>
          <div class="q-mb-sm">
            <div class="text-subtitle2">Customer</div>
            <div>{{ selected.customerName || 'Walk-in' }}</div>
            <span v-if="selected.phoneNumber" class="text-grey-6 block">{{ selected.phoneNumber }}</span>
          </div>
          <div v-if="selected.tableNumber || selected.seatNumber" class="q-mb-sm">
            <div class="text-subtitle2">Table Info</div>
            <div v-if="selected.tableNumber">Table {{ selected.tableNumber }}</div>
            <div v-if="selected.seatNumber">Seat {{ selected.seatNumber }}</div>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle2">{{ selected.status === 'open' ? 'Created' : 'Paid' }} at</div>
            <div>{{ formatDate(selected) }}</div>
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

const allOrders = computed(() => (orderStore.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

const filteredOrders = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return allOrders.value
  return allOrders.value.filter((o) => {
    return (
      o.id?.toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      String(o.phoneNumber || '').toLowerCase().includes(q) ||
      String(o.tableNumber || '').toLowerCase().includes(q) ||
      String(o.seatNumber || '').toLowerCase().includes(q)
    )
  })
})

const money = (n) =>
  new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(
    Number(n) || 0,
  )

const formatDate = (o) => {
  const date = o.status === 'open' ? o.createdAt : o.paidAt
  return new Date(date).toLocaleString()
}

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
  doc.text(invoice.status === 'open' ? 'Order Draft' : 'Invoice', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  y += 22
  doc.text(`Order #: ${invoice.id}`, margin, y)
  y += 16
  doc.text(`Customer: ${invoice.customerName || 'Walk-in'}`, margin, y)
  y += 16
  if (invoice.phoneNumber) {
    doc.text(`Phone: ${invoice.phoneNumber}`, margin, y)
    y += 16
  }
  if (invoice.tableNumber || invoice.seatNumber) {
    doc.text(`Table: ${invoice.tableNumber || ''} ${invoice.seatNumber ? 'Seat ' + invoice.seatNumber : ''}`.trim(), margin, y)
    y += 16
  }
  doc.text(`${invoice.status === 'open' ? 'Created' : 'Paid'} at: ${formatDate(invoice)}`, margin, y)

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
  doc.save(`${invoice.status === 'open' ? 'draft_' : 'invoice_'}${filenameSafeId}.pdf`)
}

const printInvoice = async (invoice) => {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let y = 52

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(invoice.status === 'open' ? 'Order Draft' : 'Invoice', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  y += 22
  doc.text(`Order #: ${invoice.id}`, margin, y)
  y += 16
  doc.text(`Customer: ${invoice.customerName || 'Walk-in'}`, margin, y)
  y += 16
  if (invoice.phoneNumber) {
    doc.text(`Phone: ${invoice.phoneNumber}`, margin, y)
    y += 16
  }
  if (invoice.tableNumber || invoice.seatNumber) {
    doc.text(`Table: ${invoice.tableNumber || ''} ${invoice.seatNumber ? 'Seat ' + invoice.seatNumber : ''}`.trim(), margin, y)
    y += 16
  }
  doc.text(`${invoice.status === 'open' ? 'Created' : 'Paid'} at: ${formatDate(invoice)}`, margin, y)

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

  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')
}

const viewInvoice = (invoice) => {
  selected.value = invoice
}
</script>
