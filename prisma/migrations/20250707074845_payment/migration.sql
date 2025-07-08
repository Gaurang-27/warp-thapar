-- CreateTable
CREATE TABLE "Payments" (
    "order_id" TEXT NOT NULL,
    "order_amount" INTEGER NOT NULL,
    "cf_payment_id" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL,
    "payment_time" TIMESTAMP(3) NOT NULL,
    "customer_id" TEXT NOT NULL,
    "payment_message" TEXT,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payments_cf_payment_id_key" ON "Payments"("cf_payment_id");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
