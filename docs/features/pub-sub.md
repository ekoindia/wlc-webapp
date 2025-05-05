# Pub/Sub

The Pub/Sub (Publish/Subscribe) pattern provides a way for components to communicate with each other without direct coupling. This is particularly useful for cross-component communication in a React application.

## How to Use Pub/Sub

### Adding a New Topic

Add your new topic in the [constants/PubSubTopics.ts](constants/PubSubTopics.ts) file. This file contains all the topics used in the application.

```typescript
// constants/PubSubTopics.ts
export const TOPICS = {
  // ...existing topics
  MY_TOPIC: 'my_topic',
};
```

### Publishing Events

To publish events to a topic:

```typescript
import { usePubSub } from "contexts";

const { publish, TOPICS } = usePubSub();
publish(TOPICS.MY_TOPIC, data);  // data = additional data to pass to the subscribers
```

### Subscribing to Events

To subscribe (listen) to the published events:

```typescript
import { usePubSub } from "contexts";

const { subscribe, TOPICS } = usePubSub();

useEffect(() => {
  const unsubscribe = subscribe(TOPICS.MY_TOPIC, (data) => {
    // Subscriber logic here...
  });

  return unsubscribe;  // Unsubscribe on component unmount
}, []);
```

## Best Practices

1. Always unsubscribe from topics when components unmount
2. Keep data payloads small and focused
3. Add new topics to the PubSubTopics constant file for better organization
4. Use meaningful topic names that describe the event