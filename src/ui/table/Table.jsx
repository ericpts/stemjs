import {UI} from "../UIBase";

// TODO: the whole table architecture probably needs a rethinking
UI.TableRow = class TableRow extends UI.Primitive("tr") {
    render() {
        let rowCells = [];

        for (let column of this.options.columns) {
            rowCells.push(this.renderEntryCell(column));
        }

        return rowCells;
    }

    renderEntryCell(column) {
        return <td style={column.cellStyle} key={column.id}>{column.value(this.options.entry, this.options.index)}</td>;
    }
};

class Table extends UI.Element {
    setOptions(options) {
        super.setOptions(options);

        this.setColumns(options.columns || []);
        this.entries = options.entries || [];
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();

        attr.addClass("ui-table table table-stripped");

        return attr;
    }

    getNodeType() {
        return "table";
    }

    getRowClass() {
        return UI.TableRow;
    }

    getRowOptions(entry) {
        return {
            entry: entry,
            columns: this.columns,
        };
    }

    render() {
        return [
            <thead>
                {this.renderTableHead()}
            </thead>,
            <tbody>
                {this.renderTableBody()}
            </tbody>
        ];
    }

    renderTableHead() {
        return <tr>{this.columns.map(this.renderHeaderCell, this)}</tr>
    }

    getEntryKey(entry, index) {
        return entry.id || index;
    }

    renderTableBody() {
        this.rows = [];

        let entries = this.getEntries();
        for (let i = 0; i < entries.length; i += 1) {
            let entry = entries[i];
            let RowClass = this.getRowClass(entry);
            this.rows.push(<RowClass key={this.getEntryKey(entry, i)} index={i} {...this.getRowOptions(entry)} parent={this}/>);
        }
        return this.rows;
    }

    // Renders the whole header cell based on a column
    renderHeaderCell(column) {
        return <th style={column.headerStyle} ref={"columnHeader" + column.id}>
                {this.renderColumnHeader(column)}
            </th>;
    }

    // Only renders the content of the header cell
    renderColumnHeader(column) {
        if (typeof column.headerName === "function") {
            return column.headerName();
        }
        return column.headerName;
    }

    // Original entries should not be modified. Overwrite this function to appy any modification in a new array.
    getEntries() {
        return this.entries || [];
    }

    columnDefaults(column, index) {
        column.id = index;
    }

    setColumns(columns) {
        this.columns = columns;
        for (let i = 0; i < this.columns.length; i += 1) {
            this.columnDefaults(this.columns[i], i);
        }
    }
};

UI.Table = Table;

export {Table};