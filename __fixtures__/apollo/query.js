import gql from 'graphql-tag';

const query = gql`
    query testQuery {
        dogs {
            id
        }
    }
`;

module.exports = query;
