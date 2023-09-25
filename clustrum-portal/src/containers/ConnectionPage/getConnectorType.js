export const getConnectorType = urlSearchPart => {
  const searchParams = new URLSearchParams(urlSearchPart);
  const connectorType = searchParams.get('connectorType');
  return connectorType;
};
