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

const operationsDoc = `
  mutation createNewUsers($issuer: String, $publicAddress: String, $email: String, $id: Int) {
    insert_Users(objects: {issuer: $issuer, publicAddress: $publicAddress, email: $email, id: $id}) {
      affected_rows
      returning {
        issuer
        publicAddress
        email
        id
      }
    }
  }
   
`;


function executecreateNewUsers(issuer, publicAddress, email, id) {
  return fetchGraphQL(
    operationsDoc,
    "createNewUsers",
    {"issuer": issuer, "publicAddress": publicAddress, "email": email, "id": id}
  );
}
  
  
export async function startExecutecreateNewUsers(issuer, publicAddress, email, id) {
  const { errors, data } = await executecreateNewUsers(issuer, publicAddress, email, id);
  
  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }
  
  // do something great with this precious data
  console.log(data);
}
  
startExecutecreateNewUsers(issuer, publicAddress, email, id);
  
export async function isNewUser(token,issuer) {
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
  return response?.data?.Users?.length === 0;
}


