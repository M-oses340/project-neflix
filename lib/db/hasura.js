export async function insertstats(
  token,
  {favourited,videoId,userId,watched}
) {
  const operationsDoc1 = `
mutation insertstats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  insert_stats_one(object: {favourited: $favourited, userId: $userId, watched: $watched, videoId: $videoId})
    {
      favourited
      videoId
      userId
      watched
    }
  }
`;
  const response = await queryHasuraGQL(
    operationsDoc1,
    "insertstats",
   {favourited,videoId,userId,watched},
   token
  );
  console.log({ response});
  if (response.errors) {
    console.log(response.errors);
  }
  

}


export async function updatestats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
mutation updatestats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  update_stats(
    _set: {watched: $watched, favourited: $favourited}, 
    where: {
      userId: {_eq: $userId}, 
      videoId: {_eq: $videoId}
    }) {
    returning {
      favourited,
      userId,
      watched,
      videoId
    }
  }
}
`;

  return await queryHasuraGQL(
    operationsDoc,
    "updatestats",
    { favourited, userId, watched, videoId },
    token
  );

  
}


export async function findVideoIdByUser(token,userId,videoId){

 const operationsDoc = `
  query findVideoIdByUser($userId: String!,$videoId: String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      id
      favourited
      userId
      videoId
      watched
    }
  }
`;
  const response = await queryHasuraGQL(
    operationsDoc,
   "findVideoIdByUser",
   {
      videoId,
      userId,
    },
    token
  );

  console.log({ response});
  if (response.errors) {
    console.log(response.errors);
  }
  return response?.data?.stats;
 
 
}

export async function createNewUser(
  token,
  {email,id,issuer}
) {
  const operationsDoc = `
mutation insertUsers($issuer: String!, $email: String!, $publicAddress: String!, $id: Int) {
  insert_Users_one(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress, id: $id}) {
    {
      email
      id
      issuer
      
    }
  }
`;
  
  const response = await queryHasuraGQL(
    operationsDoc,
    "insertUsers",
    {
      issuer,
      email,
      publicAddress,
      id
    },
    token
  );

  console.log({ response, issuer });
  if (response.errors) {
    console.log(response.errors);
  }
  return response;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    Users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;
  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );

  console.log({ response, issuer });
  if (response.errors) {
    console.log(response.errors);
  }
  return response?.data?.Users?.length > 0;
}

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
  return await result.json();
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      videoId
      
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "watchedVideos",
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}
