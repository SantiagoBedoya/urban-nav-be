import {Model, model, property} from '@loopback/repository';

@model()
export class ContactItem extends Model{
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isPrimary?: boolean;
}

@model()
export class Contacts extends Model {
  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  items: ContactItem[];


  constructor(data?: Partial<Contacts>) {
    super(data);
  }
}

export interface ContactsRelations {
  // describe navigational properties here
}

export type ContactsWithRelations = Contacts & ContactsRelations;
