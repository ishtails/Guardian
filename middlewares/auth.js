export const authenticate = (req, res, next) => {
    if (!req.session.authenticated) {
      return res.status(401).send('Unauthorized');
    }
    
    next();
}