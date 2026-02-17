-- Initial schema for Assignment Help Pro
CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Client" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "country" TEXT,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Writer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "contact" TEXT,
  "specialization" TEXT,
  "rateType" TEXT NOT NULL,
  "rateValue" REAL NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clientId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "orderType" TEXT NOT NULL,
  "subject" TEXT,
  "wordsPages" TEXT,
  "formatStyle" TEXT,
  "priceQuoted" REAL NOT NULL,
  "depositRequired" BOOLEAN NOT NULL DEFAULT false,
  "amountPaid" REAL NOT NULL DEFAULT 0,
  "writerId" TEXT,
  "writerCost" REAL,
  "status" TEXT NOT NULL DEFAULT 'New',
  "paymentStatus" TEXT NOT NULL DEFAULT 'NotPaid',
  "refusalReason" TEXT,
  "deadline" DATETIME NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "links" TEXT,
  "internalNotes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY ("writerId") REFERENCES "Writer"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "OrderActivity" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "note" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Invoice" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "invoiceNumber" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "issueDate" DATETIME NOT NULL,
  "dueDate" DATETIME NOT NULL,
  "lineItems" JSONB NOT NULL,
  "subtotal" REAL NOT NULL,
  "tax" REAL,
  "total" REAL NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Draft',
  "pdfPath" TEXT,
  "paymentLink" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "invoiceId" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "method" TEXT NOT NULL,
  "date" DATETIME NOT NULL,
  "note" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Reminder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "remindAt" DATETIME NOT NULL,
  "type" TEXT NOT NULL,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Setting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "businessName" TEXT NOT NULL DEFAULT 'Assignment Help Pro',
  "businessSubtitle" TEXT NOT NULL DEFAULT 'Academic Excellence Hub',
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "taxRate" REAL,
  "invoicePrefix" TEXT NOT NULL DEFAULT 'AHP',
  "defaultReminderHours24" BOOLEAN NOT NULL DEFAULT true,
  "defaultReminderHours6" BOOLEAN NOT NULL DEFAULT true
);
