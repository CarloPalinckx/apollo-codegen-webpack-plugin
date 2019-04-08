import gql from 'graphql-tag';

const query = gql`
    query testQuery {
        dogs {
            id
            breed
        }
    }
`;

module.exports = query;
