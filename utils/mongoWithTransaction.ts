import { Connection, ClientSession } from 'mongoose';

export const mongoWithTransaction = async (
  connection: Connection,
  fn: (session: ClientSession) => Promise<void>,
) => {
  const session = await connection.startSession();
  try {
    await session.withTransaction(async () => {
      await fn(session);
    });
  } catch (error) {
    console.error(`error.transaction : `, error);
  } finally {
    session.endSession();
  }
};
