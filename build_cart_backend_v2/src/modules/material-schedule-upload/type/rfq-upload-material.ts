import { UUID } from 'crypto';

export type RfqUploadType = {
  category: string;
  name: string;
  budget: number;
  description: string;
  ownerId?: string;
  id?: UUID;
  materialScheduleId?: string;
};

export type RfqUploadTypeBody = {
  title: string;
  csvUrl: string;
  ownerId: string;
  ProjectId: string;
};
