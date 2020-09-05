# Updating Events

## Non-Recurring Events

1. If an event is being modified to recur, compute and store the `rrule`. If the application is configured for any pre-hydration, a fixed number of initial event instances can be generated. The `start` and `end` dates are changed to be the endpoints of the recurrence range instead of an individual event instance.
2. Change any modified metadata, e.g. `name`, `description`, `picture` or other attributes.

## Recurring Events

Recurring events can be modified to change only the current instance, future instances, or all instances.

### Single-Instance Update

1. If the `start` or `end` times of a singular instance are being modified then copy these values to the `originalStart` and `originalEnd` properties while freely changing `start` and `end`.
2. Update any metadata properties freely.

### Future-Instances Update

1. Generate a new recurrence rule using the instance being modified as the starting date of the new range. Maintain a reference to the original recurrence rule for future "all-instances" updates.
3. The event instance being updated is updated to the new `start` and `end` times of the first rrule instance.
4. Any events that would have occured after the first instance are erased. If pre-hydration is done, new instances are generated here.
5. The event instance being updated and any future events can have their metadata modified.

### All-Instances Update

1. Select the parent of all of the recurring events.
2. If the `rrule` must change