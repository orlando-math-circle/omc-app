---
title: Courses
description: Developer stream of though for implementing event groupings.
category: Design Notes
position: 4
---

The calendar needs to have distinctions between each event, groupings of events, and the reusable name and other metadata for each grouping.

An analogy would be college courses, each course, e.g. COP4935 (Senior Design II) repeats every semester, but each student registers to a unique classroom (I don't know what UCF calls it) and each classroom has lectures on specific days. The "classroom" is an important distinction in that it will also function as a the purchasable unit. The admins will be able to describe if this group is paid per-event or all at once, and what occurs for late registrations.

The names of these three entities are `project` > `course` > `event`, but these are partial misnomers and discussion with the client may follow for a more apt name. Reason being, not all things are courses, e.g. tutoring, and a project sounds like a different kind of event type than a course altogether.

There are a two major approaches that come to mind when implementing a `course`.

## Indirect Assignment

1. Admins create a recurring event that lasts 2 months and they want to split the events into weekly tutoring sessions.
2. All events are tagged with a `project` named **Tutoring**, or whatever, during the creation of the recurring event.
3. On the project management page the admins can create as many courses as they want, with each course having its own metadata and a `start` and `end` time.

In this pattern, the events are associated indirectly with courses. During event retrieval, the `project` relation is joined as well as any `course` within the project relation there the `dtstart` of the event falls in the `course` `start` and `end` range.

- _Pros_: Managing courses can be done without needing to go to manually apply a course to every event.
- _Cons_: This indirect behavior can result in more casual admin errors, e.g. accidentally messing up the date ranges and not including the start or end event in a course. Furthermore, the behaviors of a `course` are largely payment related and are highly dependant on the number of events. There may be some behaviors that are ambiguous if the number of events is changed; there's no forceful reason to update a `course` or requirement to inform the admin a change they're making may be problematic, though what those behaviors might be are unknown. Furthermore, if two events occur on the same day and are part of the same project, if they were meant to be in different courses much more logic would be necessary to align courses by the same time of day, not just the date.

## Direct Assignment

1. Admins create a recurring event that lasts 2 months and they want to split the events into weekly tutoring sessions.
2. The admin creates a course and within it picks a project or creates a new one, then associates it with the event.
3. During a recurring event creation, all courses are added automatically if they want the entire range to be a single course, otherwise the courses are added to events manually.

This pattern provides more relational integrity, however without thorough UI design, utilizing these could be tedious and annoying.

- _Pros_: Highly explicit admin actions with no room for ambiguity on their part. Less data usage as courses are connected to events using a single event `id` and not a `start` and `end` for a date range.
- _Cons_: The concept of a range of events is _mostly_ unused, however some payment logic may still need to consider the total number of events, for instance, if sliding-scale payments were ever implemented. If the admins don't utilize recurring events, or use recurring events but need multiple courses within the range of the generated recurring events, most likely manual assignment is required. In theory, this is a UI problem that can be solved at a later point in time.

## UI Components

Vuetify comes with a versatile date picker that can be used for creating a course. If courses utilized a date range, the date picker component has a date range selector.

<img src="./images/notes/date-range-picker.png" />

The component also allows for events to be defined to visualize to the user what they are selecting. Though, it wouldn't show any further information about the events. However, if the course was implemented using the direct event selection method, there is an implication that the events exist before this visual aid would be helpful.

However, even if a course doesn't utilize a date range, the date picker could still be used to select a date range were the backend matches events manually for the user that happen to lie in that range, but this still may be difficult to differentiate between multiple events in a day.

<img src="./images/notes/picker-with-events.png" />
