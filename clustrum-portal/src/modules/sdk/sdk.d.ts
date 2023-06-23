export default class SDK {
  static createDashState(payload: {
    entryId: string;
    data: { params: object };
  }): Promise<{ uuid: string }>;
  static getDashState(payload: {
    uuid: 'string';
  }): Promise<{
    created_at: string;
    data: string;
    entryId: string;
    uuid: string;
  }>;
}
