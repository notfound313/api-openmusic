const routes = (handler) => [{
  method: 'POST',
  path: '/users',
  handler: handler.postUserHandler,
},
{
  method: 'GET',
  path: '/users',
  handler: handler.getUsersByUsernameHandler,
},
{
  method: 'GET',
  path: '/users/{id}',
  handler: handler.getUserByIdHandler,
},
{
  method: 'PUT',
  path: '/users/{id}',
  handler: handler.putUserByIdHandler,
},
{
  method: 'DELETE',
  path: '/users/{id}',
  handler: handler.deleteUserByIdHandler,
},
];
module.exports = routes;
