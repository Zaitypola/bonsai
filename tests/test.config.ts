import { setGlobalOptions } from '@typegoose/typegoose';

process.env.NODE_ENV = 'test';
process.env.TZ = 'utc';

// Use new enum method for Typegoose
setGlobalOptions({
  globalOptions: {
    useNewEnum: true,
  },
});
