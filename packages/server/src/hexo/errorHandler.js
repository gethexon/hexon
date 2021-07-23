export const notFound = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (err.message === 'Not found') {
            ctx.status = 404;
            ctx.body = { message: 'id not found' };
        }
        else
            throw err;
    }
};
export const hexoInitiating = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (err.message === 'Hexo initiating') {
            ctx.status = 503;
            ctx.body = { message: 'Hexo initiating' };
        }
        else
            throw err;
    }
};
export const notBlog = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        if (err.message === 'Not blog') {
            ctx.status = 400;
            ctx.body = {
                message: 'not a hexo blog'
            };
        }
        else
            throw err;
    }
};
