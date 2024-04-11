function seq(action: "enqueue" | "context" | "next", data?: any) {
  console.log("Sequencer", action, data);
  const response = fetch(`${process.env.SEQUENCER_URL}/${action}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((res) => res.json());
  console.log("Sequencer response", response);
  return response
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
  },
};
