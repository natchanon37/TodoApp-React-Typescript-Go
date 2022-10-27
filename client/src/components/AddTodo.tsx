import { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import { ENDPOINT, Todo } from "../App";
import { KeyedMutator } from "swr";

function AddTodo({ mutate }: { mutate: KeyedMutator<Todo[]> }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      body: "",
    },
  });

  async function createTodo(values: { title: string; body: string }) {
    const update = await fetch(`${ENDPOINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((r) => r.json());

    mutate(update);
    form.reset();
    setOpen(false);
  }
  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)} title="Create Todo">
        <form onSubmit={form.onSubmit(createTodo)}>
          <TextInput
            required
            mb={12}
            label="Title"
            placeholder="What do you want to do ?"
            {...form.getInputProps("title")}
          />
          <TextInput
            required
            mb={12}
            label="Details"
            placeholder="What do you want to do ?"
            {...form.getInputProps("body")}
          />
          <Button type="submit">Create todo</Button>
        </form>
      </Modal>
      <Group position="center">
        <Button
          mb={12}
          variant="light"
          size="xl"
          fullWidth
          radius="md"
          onClick={() => setOpen(true)}
        >
          Add ToDo
        </Button>
      </Group>
    </>
  );
}

export default AddTodo;
