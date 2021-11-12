import { rest } from "msw";

export const bigDataMocks = [
    rest.get('/api/bigdata/users', (req, res, ctx) => {
        return res(ctx.json({ users: ["user1", "user2"] }));
    })
]