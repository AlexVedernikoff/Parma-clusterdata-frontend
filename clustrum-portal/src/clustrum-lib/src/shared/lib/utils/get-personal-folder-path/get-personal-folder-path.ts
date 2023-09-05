//TODO: удалить когда переделают window.DL
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const getPersonalFolderPath = (): string => `Users/${window.DL.user.login}/`;
