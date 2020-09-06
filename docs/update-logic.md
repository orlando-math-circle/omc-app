# The problem of optimistic event editing.

In order to support recurring events in a system with so many relations whenever a recurring event is edited events should be re-created as little as possible. Editing recurring events calls into question the idea of algorithmic sifting, predictability, event fidelity, recurrence ranges.

## Sifting & Predictability

Sifting events is a naive idea that in order to prevent the biggest loss of data, whenever an event stream is modified each event is sorted onto the new timeline and any missing dates are created. Imagine a coin sorter, each coin will roll over a hole of increasing size in order to catch only that specific coin in each hole. If the slots are the event dates generated by the newly modified recurrence rule, how should the "coins", or events, fit these new dates using sifting?

In practicality, it doesn't work or make any sense. The easiest sifting algorithm would be to assign the first generated date to the first event, second to the second, ...etc. If the window for modification is small or the pattern is not changed much this will not be a problem. However, imagine an event that occurs once a month suddenly occuring bi-weekly. A user could register for events spanning months and have all of it condensed into a couple weeks. This imposes terrible UX.

To experiment in theory, an iteration of this idea could try to align events to the nearest date instance. Ignoring that the nearest date could still condense months of events into a small timeframe, what if the event could be moved to either of two equidistant dates? This recursively re-creates the problem. This also has issues of contextualizing _how_ the recurrence was changed, as if it removes events you need to decide which to destroy in potentially ambiguous situations.

## Fidelity

The `rrule` specification has conceptual support for repeating events at hyper-specific intervals. Without listing all of the patterns Google supports, it is not possible to specify an event that repeats sub-daily. If the user wanted sub-day fidelity they could utilize multiple parallel patterns.

It's not useful to move event registrations to different days. However, if an event occurs on a specific day in one recurrence pattern regardless of the time of day, there is no reason to delete that event. Exploring how to accomplish this:

1. Download all events for the old event recurrence.
2. Generate the new `rrule`.
3. Generate the dates from the `rrule` for a range consisting of the earliest `dtstart` in the downloaded events and the latest `dtstart`.
4. Iterate through the events and if an event is on the same day as a generated date, replace the `dtstart` with the generated date.
5. Otherwise, if the event doesn't have a corresponding day, erase it.