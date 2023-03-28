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
  return response;
 
 
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!, $id: Int!) {
    insert_Users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress, id: $id}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress, id } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
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
  return response?.data?.users?.length === 0;
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
