import { test, expect, APIRequestContext } from '@playwright/test';

test.use({
  baseURL: 'http:localhost:8080/todos/',
});

test.describe.configure({ mode: 'serial' });

const TODO_ITEMS = ['buy some cheese', 'feed the cat', 'book a doctors appointment'] as const;

test.beforeEach(async ({ request }) => {
  await createDefaultTodos(request);
});

async function createDefaultTodos(request: APIRequestContext) {
  // Not using promise.all since the sequence matters
  const response1 = await request.post('./', {
    data: {
      description: TODO_ITEMS[0],
    },
  });
  expect(response1.ok()).toBeTruthy();
  const response2 = await request.post('./', {
    data: {
      description: TODO_ITEMS[1],
    },
  });
  expect(response2.ok()).toBeTruthy();
  const response3 = await request.post('./', {
    data: {
      description: TODO_ITEMS[2],
    },
  });
  expect(response3.ok()).toBeTruthy();
}

test.afterEach(async ({ request }) => {
  const response = await request.delete(`./`);
  expect(response.ok()).toBeTruthy();
});

test.describe('Create todo', () => {
  test('Should be able to add todo', async ({ request }) => {
    const newTodoResponse = await request.post('./', {
      data: {
        description: 'New todo',
      },
    });

    expect(newTodoResponse.ok()).toBeTruthy();

    const todosResponse = await request.get(`./`);

    expect(todosResponse.ok()).toBeTruthy();
    expect(await todosResponse.json()).toHaveLength(4);

    expect(await todosResponse.json()).toContainEqual(
      expect.objectContaining({
        description: 'New todo',
      })
    );
  });
});

test.describe('Read todo', () => {
  test('Should be able to get todo', async ({ request }) => {
    const todosResponse = await request.get(`./`);
    expect(todosResponse.ok()).toBeTruthy();

    expect(await todosResponse.json()).toHaveLength(3);

    for (const item of TODO_ITEMS) {
      expect(await todosResponse.json()).toContainEqual(
        expect.objectContaining({
          description: item,
        })
      );
    }
  });
});

test.describe('Update todo', () => {
  test('Should be able to edit single todo', async ({ request }) => {
    const todosResponse = await request.get(`./`);
    expect(todosResponse.ok()).toBeTruthy();

    const originalTodos = await todosResponse.json();

    expect(originalTodos).toHaveLength(3);

    const secondTodoId = originalTodos[1].id;

    const updatedTodoResponse = await request.patch(`./${secondTodoId}`, {
      data: {
        description: originalTodos[1].description,
        completed: true,
      },
    });
    expect(updatedTodoResponse.ok()).toBeTruthy();

    expect(await updatedTodoResponse.json()).toEqual(
      expect.objectContaining({
        description: originalTodos[1].description,
        completed: true,
      })
    );
  });
});

test.describe('Delete todo', () => {
  test('Should be able to delete single todo', async ({ request }) => {
    const todosResponse = await request.get(`./`);
    expect(todosResponse.ok()).toBeTruthy();

    const originalTodos = await todosResponse.json();

    expect(originalTodos).toHaveLength(3);

    const secondTodoId = originalTodos[1].id;

    const updatedTodoResponse = await request.delete(`./${secondTodoId}`);
    expect(updatedTodoResponse.ok()).toBeTruthy();

    const todosAfterDeleteResponse = await request.get(`./`);
    expect(todosAfterDeleteResponse.ok()).toBeTruthy();

    expect(await todosAfterDeleteResponse.json()).toHaveLength(2);
  });

  test('Should be able to delete all todos', async ({ request }) => {
    const todosResponse = await request.get(`./`);
    expect(todosResponse.ok()).toBeTruthy();

    const originalTodos = await todosResponse.json();

    expect(originalTodos).toHaveLength(3);

    const deleteTodoResponse = await request.delete(`./`);
    expect(deleteTodoResponse.ok()).toBeTruthy();

    const todosAfterDeleteResponse = await request.get(`./`);
    expect(todosAfterDeleteResponse.ok()).toBeTruthy();

    expect(await todosAfterDeleteResponse.json()).toHaveLength(0);
  });
});
