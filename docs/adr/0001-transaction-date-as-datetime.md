# Transaction Date is stored as a full DateTime, interpreted in Asia/Bangkok

The user only ever picks a day, yet a Transaction's date is stored as a full `DateTime`, not as a calendar-date string (`YYYY-MM-DD`). The owner chose this over date-only storage, which would have removed UTC day-shift bugs by construction. A future reader may want to "simplify" this to a date-only column. Do not do that without superseding this ADR.

## Considered Options

- **Calendar-date string (`YYYY-MM-DD`)**: no timezone exists to get wrong, and monthly filtering is a plain string comparison. Rejected by the owner.
- **Full `DateTime`, normalised to 00:00 Bangkok**: in practice a date-only column with extra conversion risk. Rejected.
- **Full `DateTime` with time filled in automatically (chosen)**: if the picked day is today, the time is the current time; otherwise it is 12:00 Asia/Bangkok.

## Consequences

- Every Month boundary must be computed as midnight Asia/Bangkok and then converted to UTC for queries. A query that uses UTC month boundaries is a bug: a Transaction recorded at 23:30 on the 31st, Bangkok time, would land in the next Month.
- The 12:00 default for days other than today keeps the instant safely inside its Bangkok day, so a later conversion error of up to ±11 hours cannot move it into a different day.
- Transactions within one day sort by their stored time, then by `createdAt`.
- CSV carries `date` (`YYYY-MM-DD`) and an optional `time` (`HH:mm`, Bangkok); a missing `time` becomes 12:00. Duplicate detection by fingerprint compares the Bangkok calendar day, not the instant.
- Tests must cover month-edge Transactions (the first and last day of a Month, late at night Bangkok time) for both the monthly totals and the monthly filter.
