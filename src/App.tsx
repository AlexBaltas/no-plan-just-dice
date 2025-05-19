import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  
  return (
    <main>
      <h1>Hello World!</h1>
    </main>
  );
}

export default App;
