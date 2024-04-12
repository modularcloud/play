async function seq(action: "enqueue" | "context" | "next", data?: any) {
  const body = data ? JSON.stringify(data) : undefined;
  console.log({
    Sequencer: {
      url: `${process.env.SEQUENCER_URL}/${action}`,
      action,
      data: body
    }
  });
  const response = await fetch(`${process.env.SEQUENCER_URL}/${action}`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: body
  }).then((res) => res.json());
  console.log({
    "Sequencer response": response
  });
  return response;
}

export const Sequencer = {
  enqueue: async (data: any) => {
    await seq("enqueue", data);
    return data;
  },
  next: async () => {
    await seq("next");
  },
  oraclize: async (dataOrFn: any) => {
    let payload = dataOrFn;
    if (typeof dataOrFn === "function") {
      payload = await dataOrFn();
    }
    await seq("context", payload);
    return payload;
  }
};
