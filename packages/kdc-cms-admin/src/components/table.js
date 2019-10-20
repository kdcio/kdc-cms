import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const TableNoBody = ({ children }) => {
  const [thead, tbody] = children;
  return (
    <Table hover striped responsive>
      {thead}
      {tbody.props.children.length === 0 ? (
        <tbody>
          <tr>
            <td colSpan={thead.props.children.props.children.length} className="text-center">
              -- none --
            </td>
          </tr>
        </tbody>
      ) : (
        tbody
      )}
    </Table>
  );
};

TableNoBody.propTypes = {
  children: PropTypes.array.isRequired,
};

export default TableNoBody;
