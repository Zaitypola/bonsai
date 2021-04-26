import { User } from '../../source/models/user';
import { createUser } from '../../source/services/user';

export const createTestUsers = async (numUsers): Promise<User[]> =>
  Promise.all(
    Array.from({ length: numUsers }, (_, index) => index + 1).map((value) =>
      createUser({
        publicId: value,
        username: `user${value}`,
        email: `example${value}@mail.com`,
        phone: `555-123${value}`,
      }),
    ),
  );
