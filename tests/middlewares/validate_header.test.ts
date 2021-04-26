import {NextFunction, Request, Response} from "express";
import * as httpStatus from "http-status";
import {validateHeader} from "../../source/middlewares/validate_header_middleware";

import sinon from 'sinon'

describe('Tests validate header middleware', () => {
    const sandbox = sinon.createSandbox()

    beforeEach(() => {
        sandbox.restore()
    })

    afterEach(() => {
        sandbox.restore()
    })


    it('Header is present', () => {
        const request = {
            header: (expectedHeader) => expectedHeader
        }

        const res = {
            status: sandbox.spy()
        }

        const next = sandbox.spy()

        validateHeader('BonsaiDeveloper')(request as Request, res as Response, next as NextFunction)

        sandbox.assert.calledOnce(next)
        sandbox.assert.notCalled(res.status)
    })

    it('Header is not present', () => {
        const request = {
            header: sandbox.stub().returns()
        }

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        const next = sandbox.spy()

        validateHeader('BonsaiDeveloper')(request as Request, res as Response, next as NextFunction)

        sandbox.assert.notCalled(next)
        sandbox.assert.calledOnceWithExactly(res.status, httpStatus.BAD_REQUEST)
        sandbox.assert.calledOnce(res.json)
    })
})