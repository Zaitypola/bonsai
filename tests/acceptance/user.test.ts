import * as httpStatus from "http-status";
import {errors} from "../../source/errors";
import {findOneUser} from "../../source/services/user";
import {syncUsersService} from "../utils/api/sync_users";
import {createTestUsers} from "../utils/create_test_users";
import {getFetchUserMock} from "../utils/mocks/fetch_store_user_mock";
import {nockHooks} from "../utils/nock_hooks";
import {serviceHooks} from "../utils/service_hooks";

describe('Tests user sync feature', () => {
    serviceHooks();
    nockHooks();

    it('Tests sync users feature - sync API call works', async () => {
        const createdUsers = await createTestUsers(50)

        // Only mock first 8 even public ids.
        const targetUsers = createdUsers
            .filter((user, index) => user.publicId % 2 === 0 && index < 17)

        const allMocks = targetUsers.map(user => {
                const response = {
                    statusCode: 200,
                    body: {
                        publicId: user.publicId,
                        username: user.username,
                        email: `new${user.publicId}@mail.com`,
                        phone: `555-123${user.publicId}`
                    }
                }

                return getFetchUserMock(user.publicId, response)
            })

        const {status} = await syncUsersService()

        expect(status).toEqual(httpStatus.OK)

        allMocks.forEach(mock => mock.done())

        await Promise.all(targetUsers.map(async user => {
            const updatedUser = await findOneUser({ _id: user._id})

            expect(updatedUser.email).toEqual(`new${user.publicId}@mail.com`)
        }))
    })

    it('Tests sync users feature - sync API call does not work', async () => {
        const createdUsers = await createTestUsers(50)

        const user = createdUsers.find(user => user.publicId === 2)

        const response = {
            statusCode: 200,
            body: {
                publicId: user!.publicId,
                username: user!.username,
                email: `new${user!.publicId}@mail.com`,
                phone: `555-123${user!.publicId}`
            }
        }

        const fetchUserMock = getFetchUserMock(user!.publicId, response)

        const {status, data} = await syncUsersService()

        expect(status).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
        expect(data).toMatchObject(errors.ERROR_SYNC_USER_CALL)

        fetchUserMock.done()
    })
})