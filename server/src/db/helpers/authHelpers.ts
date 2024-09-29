interface Context {
    user?: string | null;
  }

export const checkAuth = (context: Context) => {
  if (!context.user) {
    throw new Error('Unauthorized, please add a valid token in the Authorization header');
  }
};
