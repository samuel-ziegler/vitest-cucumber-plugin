import { Given, When, Then, DataTable } from 'vitest-cucumber-plugin';
import { expect } from 'vitest'
import _ from 'lodash/fp';

Given('the following data:',(state,params,data) => {
    return DataTable(data);
});

When('the following ids are removed:',(state,params,data) => {
    const ids = _.flatten(data);

    return _.filter((value) => {
        return !_.find((id) => id == value.id,ids);
    })(state);
});

Then('the data will contain the following:',(state,params,data) => {
    const expectedDataTable = DataTable(data);

    expect(expectedDataTable).toEqual(state);
});
