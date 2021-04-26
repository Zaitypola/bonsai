import {NextFunction, Request, Response} from "express";
import * as httpStatus from "http-status";
import {bodyValidator} from "../../source/middlewares/body_validator";
import {checkoutBodySchema} from "../../source/schemas/checkout_body_schema";

import sinon from 'sinon'

describe('Tests validate body middleware', () => {
    const sandbox = sinon.createSandbox()

    beforeEach(() => {
        sandbox.restore()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('Body is valid', () => {
        const req = {
            body: {
                userId: 1,
                date: '2020-01-01',
                products: [
                    {productId: 1, quantity: 2},
                    {productId: 2, quantity: 3}
                ]
            }
        }

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        const next = sandbox.spy()

        bodyValidator(checkoutBodySchema)(req as Request, res as Response, next as NextFunction)

        sandbox.assert.calledOnce(next)
        sandbox.assert.notCalled(res.status)
        sandbox.assert.notCalled(res.json)
    })

    it('Body is invalid', () => {
        const req = {
            body: {
                foo: 'bar'
            }
        }

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        const next = sandbox.spy()

        bodyValidator(checkoutBodySchema)(req as Request, res as Response, next as NextFunction)

        sandbox.assert.notCalled(next)
        sandbox.assert.calledOnceWithExactly(res.status, httpStatus.BAD_REQUEST)
        sandbox.assert.calledOnce(res.json)
    })
})