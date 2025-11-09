import { Event } from '../src/events/event.entity';

function createEvent(
  start: string,
  end: string,
): Pick<Event, 'startTime' | 'endTime'> {
  return {
    startTime: new Date(start),
    endTime: new Date(end),
  };
}

describe('Event Merge Grouping Logic', () => {
  it('groups overlapping events', () => {
    const events = [
      createEvent('2025-01-01T10:00:00Z', '2025-01-01T11:00:00Z'),
      createEvent('2025-01-01T10:30:00Z', '2025-01-01T11:30:00Z'),
      createEvent('2025-01-02T09:00:00Z', '2025-01-02T10:00:00Z'),
    ];

    const groups: Pick<Event, 'startTime' | 'endTime'>[][] = [];

    for (const event of events.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    )) {
      let placed = false;

      for (const group of groups) {
        for (const e of group) {
          if (event.startTime < e.endTime && event.endTime > e.startTime) {
            group.push(event);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }

      if (!placed) groups.push([event]);
    }

    expect(groups.length).toBe(2);
    expect(groups[0].length).toBe(2);
    expect(groups[1].length).toBe(1);
  });
});
