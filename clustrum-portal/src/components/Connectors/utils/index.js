const getErrorMessage = (emptyFields, fieldType) => {
  return emptyFields.includes(fieldType) ? 'Поле обязательно для заполнения' : '';
};

const getCounterSelectItems = (counters = []) => {
  return counters.map(({ id, name, create_time: createTime }) => {
    return {
      key: id,
      value: String(id),
      title: name ? `${name} (${id})` : id,
      createTime,
    };
  });
};

export { getErrorMessage, getCounterSelectItems };
