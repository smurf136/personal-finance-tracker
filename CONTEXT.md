# Personal Finance Tracker

A single-person ledger of income and expenses, summarised by calendar month in the Asia/Bangkok timezone.

## Language

**Transaction**:
One recorded movement of money, either income or expense, with a positive amount, a category, and a transaction date.
_Avoid_: Entry, record, รายการเดินบัญชี

**Transaction Date**:
The moment a Transaction happened, interpreted in Asia/Bangkok. The user picks only the day; the time is the current time when the day is today, otherwise 12:00 Bangkok time.
_Avoid_: Created date, timestamp

**Category**:
A label that groups Transactions of one fixed type (income or expense). Its name is unique within its type, archived Categories included.
_Avoid_: Tag, group, หมวดย่อย

**Archived Category**:
A Category hidden from the choices for new Transactions but still shown on the Transactions that use it. Only a Category with no Transactions can be deleted instead.
_Avoid_: Deleted category, inactive category

**Fallback Category**:
The one Category per type (seeded as "อื่น ๆ") that receives imported Transactions whose category is unknown. It can be renamed but never archived or deleted.
_Avoid_: Default category, uncategorised

**Month**:
A calendar month whose boundaries are midnight Asia/Bangkok, never UTC.
_Avoid_: Period, billing cycle

**Monthly Net**:
Total income minus total expenses of Transactions dated within one Month. It says nothing about money held in any bank account. UI label: "คงเหลือสุทธิเดือนนี้".
_Avoid_: Balance, net balance, ยอดคงเหลือ

## Moving data in and out

**Import**:
Adding Transactions from a CSV file to the existing data. Rows already present are skipped, never overwritten.
_Avoid_: Restore, merge

**Backup**:
A versioned file holding every Category and Transaction, sufficient to rebuild the whole ledger.
_Avoid_: Export, dump

**Restore**:
Replacing the entire ledger with the contents of one Backup, all or nothing.
_Avoid_: Import, merge
