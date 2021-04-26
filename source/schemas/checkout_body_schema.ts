'use strict'

export const checkoutBodySchema = {
    "type": "object",
    "properties": {
        "userId": {
            "type": "number"
        },
        "date": {
            "type": "string"
        },
        "products": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "productId": {
                        "type": "number"
                    },
                    "quantity": {
                        "type": "number"
                    }
                }
            }
        }
    },
    "required": ["userId", "date", "products"],
    "additionalProperties": false
}