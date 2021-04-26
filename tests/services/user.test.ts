import {
    createUser,
    fetchUserById,
    findOneUser,
    getEvenUsers,
    syncEvenUsers,
    syncUser,
    syncUsers
} from "../../source/services/user";
import {createTestUsers} from "../utils/create_test_users";
import {initDb} from "../utils/db";
import {getFetchUserMock} from "../utils/mocks/fetch_store_user_mock";
import {errors} from "../../source/errors";
import {nockHooks} from "../utils/nock_hooks";


describe('User services', () => {
    initDb();
    nockHooks();

    it('Fetches user data from api correctly', async () => {
        const publicId = 5

        const fetchUserMock = getFetchUserMock(publicId)

        try {
            await fetchUserById(publicId)
            fetchUserMock.done()
        } catch (error) {
            expect(error).toBeNull()
        }
    })

    it('Fetches user data from api - call fails', async () => {
        const publicId = 5

        const response = {
            statusCode: 500
        }

        const fetchUserMock = getFetchUserMock(publicId, response)

        try {
            await fetchUserById(publicId)
        } catch (error) {
            fetchUserMock.done()
            expect(error).toMatchObject(errors.ERROR_SYNC_USER_CALL)
        }
    })

    it('Tests sync single user function', async () => {
        const userInput = {
            publicId: 1,
            username: 'user',
            email: 'example@mail.com',
            phone: '555-1234'
        }

        const createdUser = await createUser(userInput)

        const response = {
            statusCode: 200,
            body: {
                publicId: 1,
                username: 'user',
                email: 'new@mail.com',
                phone: '555-1234'
            }
        }

        const fetchUserMock = getFetchUserMock(createdUser.publicId, response)

        try {
            await syncUser(createdUser)
        } catch (error) {
            expect(error).toBeNull()
        }

        const updatedUser = await findOneUser({ _id: createdUser._id })

        fetchUserMock.done()
        expect(updatedUser.email).toEqual('new@mail.com')
    })

    it('Tests sync single user function - sync call fails', async () => {
        const userInput = {
            publicId: 1,
            username: 'user',
            email: 'example@mail.com',
            phone: '555-1234'
        }

        const createdUser = await createUser(userInput)

        const response = {
            statusCode: 500
        }

        const fetchUserMock = getFetchUserMock(createdUser.publicId, response)

        try {
            await syncUser(createdUser)
        } catch (error) {
            expect(error).toMatchObject(errors.ERROR_SYNC_USER_CALL)
        }

        fetchUserMock.done()
    })

    it('Tests get even users - less than 8', async () => {
        await createTestUsers(2)

        const evenUsers = await getEvenUsers()

        expect(evenUsers.length).toEqual(1)
        expect(evenUsers[0].publicId).toEqual(2)
    })

    it('Tests get even users - more than 8', async () => {
        await createTestUsers(100)

        const evenUsers = await getEvenUsers()

        expect(evenUsers.length).toEqual(8)
        expect(evenUsers.every(user => user.publicId % 2 === 0)).toEqual(true)
    })

    it ('Tests sync list of users - all calls work', async () => {
        const numUsers = 5
        const createdUsers = await createTestUsers(numUsers)

        const allMocks = createdUsers
            .map(user => {
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

        try {
            await syncUsers(createdUsers)
        } catch (error) {
            expect(error).toBeNull()
        }

        allMocks.forEach(mock => mock.done())

        await Promise.all(createdUsers.map(async user => {
            const updatedUser = await findOneUser({ _id: user._id })

            expect(updatedUser.email === `new${user.publicId}@mail.com`)
        }))
    })

    it ('Tests sync list of users - first call fails ', async () => {
        const numUsers = 5
        const createdUsers = await createTestUsers(numUsers)

        const user = createdUsers[0]

        const response = {
            statusCode: 500,
            body: {
                error: 'Internal server error'
            }
        }

        const fetchUserMock = getFetchUserMock(user.publicId, response)

        try {
            await syncUsers(createdUsers)
        } catch (error) {
            expect(error).toMatchObject(errors.ERROR_SYNC_USER_CALL)
        }

       fetchUserMock.done()
    })

    it('Tests sync even users', async () => {
        const numUsers = 12
        const createdUsers = await createTestUsers(numUsers)

        const targetUsers = createdUsers
            .filter(user => user.publicId % 2 === 0)

        const allMocks = targetUsers
            .map(user => {
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

        try {
            await syncEvenUsers()
        } catch (error) {
            expect(error).toBeNull()
        }

        allMocks.forEach(mock => mock.done())

        await Promise.all(targetUsers.map(async user => {
            const updatedUser = await findOneUser({ _id: user._id })

            expect(updatedUser.email).toEqual(`new${user.publicId}@mail.com`)
        }))
    })
})