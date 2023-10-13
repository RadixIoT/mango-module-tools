/*
 * Copyright (C) 2023 Radix IoT LLC. All rights reserved.
 */

const testHelper = require('@radixiot/mango-module-tools/test-helper/testHelper');

describe('testHelper Test suite', function () {

    it('Test assertPermissionEqual', function () {
        testHelper.assertPermissions([ 'role1' ], 'role1');
        testHelper.assertPermissions([ [ 'user', 'superadmin' ], [ 'user' ] ],
                [ [ 'superadmin', 'user' ], [ 'user' ] ]);
        testHelper.assertPermissions([ 'role1', 'role2' ], 'role1,role2');
        testHelper.assertPermissions([ 'role2', 'role1' ], 'role1, role2');
        testHelper.assertPermissions([ 'role2', 'role1' ], ' role1, role2');
        testHelper.assertPermissions([ 'role1' ], [ 'role1' ]);
        testHelper
                .assertPermissions([ 'role1', 'role2' ], [ 'role1', 'role2' ]);
        testHelper
                .assertPermissions([ 'role2', 'role1' ], [ 'role1', 'role2' ]);
        testHelper.assertPermissions([ 'role1', [ 'role2', 'role3' ] ], [
                'role1', [ 'role2', 'role3' ] ]);
        testHelper.assertPermissions([ [ 'role2', 'role3' ], 'role1' ], [
                'role1', [ 'role2', 'role3' ] ]);
        testHelper.assertPermissions([ [ 'role3', 'role2' ], 'role1' ], [
                'role1', [ 'role2', 'role3' ] ]);
    });
});
