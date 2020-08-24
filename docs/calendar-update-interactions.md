# Calendar Update Interactions

These are notable behaviors and interactions when investigating how Google Calendar handles event updating. This document makes reference to `pivot` events, or events that are not the first in a recurrence that "pivot" between events before and after them.

1. If an event with a specific `count` of events is split, the `count` is updated to match after the new pivot. For example, making future events later in a recurrence stream will make a new rule, however it should not maintain the same count otherwise it is not different than resetting the count.

## Updating Future Events

These are behaviors observed from Google Calendar when updating streams of recurring events by selecting the "This and following events" option.

### Using a Pivot Event

These first behaviors were observed when updating an event that was _not_ the first event in a recurrence stream.

- Changing `count` splits the rule and recreates events past the pivot, up to the new `count`. Destructive.
- Changing an `until` date splits the rule and recreates the events past the pivot. Destructive.
- Changing `dtstart`, or moving the pivot instance, splits the rule and recreates events past the pivot. Destructive.
- Postdating an event's `until` date splits the rule and is only able to move the instance. This does not change the `until` date. Destructive.
- Backdating an event before the `until` date recreates the events past the pivot. Destructive.
- Postdating an event with a `count` splits the rule and recreates events past the pivot. Destructive.
- Backdating an event with a `count` splits the rule and recreates events past the pivot. Destructive.
- Changing event meta information overwrote the meta information of events past the pivot, but did not recreate the events entirely. This did not overrite meta not being changed, e.g. a name change did not overwrite a note exception. **Non-Destructive**.
- Moving `dtstart` earlier into the day splits the rule and recreates events past the pivot. Destructive.
- Moving `dtstart` later into the day splits the rule and recreates events past the pivot. Destructive.
- Moving `dtend` later into the day only changed `dtend` for events past the pivot, however, if an event exception would start later than this, it's `dtstart` is reset. **Semi-destructive?**.
- Moving `dtend` earlier into the day only changed `dtend`or events past the pivot, however, if an event exception would start later than this, its `dtstart` is reset. **Semi-Destructive?**

As expected, meta information seemed to be written to all following events as it was given. If there were multiple types of custom metadata on each event, updating a pivot's meta would only change the specific attributes that were being changed. Interestingly however, a similar thing occured for the `dtend` of dates.

This ability to shorten the `dtend` seems to be an odd feature, but likely a byproduct of it simply being easy to do so. By contrast `dtstart` is generated from the `rrule` and to change it or offset it could either deviate highly from the spec or overcomplicate it greatly.

### Using the first event in a stream

These updates were made by selecting the first ever event in a stream of recurring events. This should be functionally no different from selecting the "All events" option.

- Changing `count` removes or adds events as necessary, but does not recreate event exceptions. **Semi-Destructive**.
- Changing `until` removes or adds events as necessary, but does not recreate event exceptions. **Semi-Destructive**.
- Changing between `until` and `count` on the first event keeps events if possible. **Semi-Destructive**.
- Moving `dtstart` (the first instance) into the future or past erases or creates events as necessary. Notably, the moved instance can overlap an event and destroy it.\* **Semi-Destructive**
- Moving the event past the `until` date does not change the recurrence and removes all other events. **Destructive**.
- Moving an event past the `count` causes it to re-create all events up to the count again. **Destructive**.
- Moving the event into the past only creates or deletes events as necessary (in the case of `count`). **Semi-Destructive**.

The most notable behavior here was if the moved first instance is moved into the future to overlap an event, one of them is destroyed. Testing this further revealed that the element that was already in that position is the one to survive, not the one to arrive (exceptions remained).

## Updating All Events

These tests were done to see what occurs when selecting the "all events" option. Notably, differences in behavior compared to selecting "future events" on the first event. However, most behaviors tested above do not apply to "all events", specifically moving events.

- Changing `count` removes or adds events as necessary, but does not recreate event exceptions. **Semi-Destructive**.
- Changing `until` removes or adds events as necessary, but does not recreate event exceptions. **Semi-Destructive**.
- Changing between `until` and `count` on the first event keeps events if possible. **Semi-Destructive**.
- Changing metadata changed only the information modified among all other events. **Non-Destructive**.

## Conclusions & Inferences

These observed behaviors shine a light onto how Google Calendar may be implemented and how to handle these event changes.

To begin, there are significant concerns when an update behavior is destructive. Events could have parents sign up early, pay event dues, or register their children far ahead of the date. Sequentially, an administrator could be told that all future instances of an event now start an hour later, so they make the necessary update. As it stands, all of those future events would be deleted and recreated.

The first thought here is why not build some kind of event rectifier and do our best to ensure events aren't deleted? Google doesn't bother with this because it uses a standard calendar model where recurring events are likely to always be the same and differences between them are occasional, e.g. exceptions in the truest sense of the word.

### Why doesn't Google update "future events" non-destructively?

1. If `count` or `until` are changed events are not going to move, so why are they recreated? The pattern is the same but it could be cut or lengthened.
2. If the starting date is changed events can be created or destroyed to fill the gaps.
3. If the starting time for events is changed, the difference between these times could be found to make matches and re-align existing events to their new dates.
4. If the general pattern of events is changed, not all types of pattern changes will need to recreate all events, e.g. every 1 day for 3 days to every 2 days for 3 days would delete the middle event.
5. The above do not require knowing the bounds or all dates of a `rrule` meaning it may not be infinitely recurring events faults, similarly this excuse does not apply to "all event" updates or updates to the first event in a recurrence.
6. If the pattern changed in a way where none of the old events matched, does it make sense to shift-left until they do match? It makes more sense to shift left, but a combination of changes such as an earlier `dtstart` and pattern could result in events that were once far apart very close, or vice versa. Maintaining those relations make little sense.

Illustration of the issue of event assigments losing context over relatively shorty periods of time. The third event may not be deleted, but an event someone registered for on Sunday may suddenly be moved to Tuesday.

```
*-----*-----*-----*-----*-----*-----*-----*
| Mon | Tue | Wed | Thu | Fri | Sat | Sun |
*-----*-----*-----*-----*-----*-----*-----*

Original Recurrence
*-----*-----*-----*-----*-----*-----*-----*
|  x  |     |     |  x  |     |     |  x  |
*-----*-----*-----*-----*-----*-----*-----*

Changed Recurrence
*-----*-----*-----*-----*-----*-----*-----*
|  x  |     |     |     |  x  |     |     |
*-----*-----*-----*-----*-----*-----*-----*
```

# Calendar Expectations

1. Sub-day repeating intervals are not permitted.
2. If
