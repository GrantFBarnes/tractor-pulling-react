import React, { Component } from "react";

import { DataTable } from "carbon-components-react";

const {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    TableToolbar,
    TableToolbarSearch,
    TableContainer
} = DataTable;

class ResultsTable extends Component {
    constructor() {
        super();
        this.state = {
            headers: [
                { key: "position", header: "Position" },
                { key: "name", header: "Name" },
                { key: "tractor", header: "Tractor" },
                { key: "distance", header: "Distance" }
            ],
            rows: []
        };
    }

    updateComponent() {
        this.setState({
            rows: [
                {
                    id: "randomid1",
                    position: 1,
                    name: "Grant Barnes",
                    tractor: "Case 1030",
                    distance: 275.1
                },
                {
                    id: "randomid2",
                    position: 2,
                    name: "Frank Barnes",
                    tractor: "Farmall 450",
                    distance: 194.4
                },
                {
                    id: "randomid3",
                    position: 3,
                    name: "Brandon Barnes",
                    tractor: "Allis Chalmers WD45",
                    distance: 143.8
                }
            ]
        });
    }

    componentWillMount() {
        this.updateComponent();
    }

    componentDidUpdate(oldProps) {
        if (oldProps !== this.props) {
            this.updateComponent();
        }
    }

    render() {
        return (
            <DataTable
                rows={this.state.rows}
                headers={this.state.headers}
                isSortable
                render={({ rows, headers, getHeaderProps, onInputChange }) => (
                    <TableContainer>
                        <TableToolbar>
                            <TableToolbarSearch onChange={onInputChange} />
                        </TableToolbar>
                        <Table>
                            <TableHead>
                                <tr>
                                    {headers.map(header => (
                                        <TableHeader
                                            {...getHeaderProps({
                                                header
                                            })}
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </tr>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.id}>
                                        {row.cells.map(cell => (
                                            <TableCell key={cell.id}>
                                                {cell.value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            />
        );
    }
}

export default ResultsTable;
