define([ "jquery", "js/spec_helpers/create_sinon", "js/spec_helpers/edit_helpers",
        "js/views/xblock_editor", "js/models/xblock_info"],
    function ($, create_sinon, edit_helpers, XBlockEditorView, XBlockInfo) {

        describe("XBlockEditorView", function() {
            var model, editor;

            beforeEach(function () {
                edit_helpers.installEditTemplates();
                model = new XBlockInfo({
                    id: 'testCourse/branch/draft/block/verticalFFF',
                    display_name: 'Test Unit',
                    category: 'vertical'
                });
                editor = new XBlockEditorView({
                    model: model
                });
            });

            describe("Editing an xblock", function() {
                var mockXBlockEditorHtml, displayName;

                beforeEach(function () {
                    edit_helpers.installMockXBlock();
                });

                afterEach(function() {
                    edit_helpers.uninstallMockXBlock();
                });

                mockXBlockEditorHtml = readFixtures('mock/mock-xblock-editor.underscore');

                it('can render itself', function() {
                    var requests = create_sinon.requests(this);
                    editor.render();
                    create_sinon.respondWithJson(requests, {
                        html: mockXBlockEditorHtml,
                        "resources": []
                    });

                    expect(editor.$el.select('.xblock-header')).toBeTruthy();
                    expect(editor.getMode()).toEqual('editor');
                });
            });

            // Why does this work on devstack but fail on Jenkins?
            /*
            describe("Editing an xblock with custom metadata", function() {
                var mockXBlockEditorHtml, displayName;

                displayName = 'Test Display Name';

                afterEach(function() {
                    edit_helpers.uninstallMockXBlock();
                });

                mockXBlockEditorHtml = readFixtures('mock/mock-xblock-editor-with-custom-metadata.underscore');

                it('saves any custom metadata', function() {
                    var requests = create_sinon.requests(this), metadata;
                    edit_helpers.installMockXBlock({
                        data: "<p>Some HTML</p>",
                        metadata: {
                            display_name: displayName
                        }
                    });
                    editor.render();
                    create_sinon.respondWithJson(requests, {
                        html: mockXBlockEditorHtml,
                        "resources": []
                    });
                    editor.save();
                    request = requests[requests.length - 1];
                    response = JSON.parse(request.requestBody);
                    metadata = response.metadata
                    expect(metadata.display_name).toBe(displayName);
                    metadata = editor.getChangedMetadata();
                    expect(metadata.custom_field).toBe('Custom Value');
                });
            });
            */

            describe("Editing an xmodule", function() {
                var mockXModuleEditorHtml;

                mockXModuleEditorHtml = readFixtures('mock/mock-xmodule-editor.underscore');

                beforeEach(function() {
                    // Mock the VerticalDescriptor so that the module can be rendered
                    window.VerticalDescriptor = XModule.Descriptor;
                });

                afterEach(function () {
                    window.VerticalDescriptor = null;
                });

                it('can render itself', function() {
                    var requests = create_sinon.requests(this);
                    editor.render();
                    create_sinon.respondWithJson(requests, {
                        html: mockXModuleEditorHtml,
                        "resources": []
                    });

                    expect(editor.$el.select('.xblock-header')).toBeTruthy();
                    expect(editor.getMode()).toEqual('editor');
                });
            });

            describe("Editing an xmodule (settings only)", function() {
                var mockXModuleEditorHtml;

                mockXModuleEditorHtml = readFixtures('mock/mock-xmodule-settings-only-editor.underscore');

                beforeEach(function() {
                    edit_helpers.installEditTemplates();

                    // Mock the VerticalDescriptor so that the module can be rendered
                    window.VerticalDescriptor = XModule.Descriptor;
                });

                afterEach(function () {
                    window.VerticalDescriptor = null;
                });

                it('can render itself', function() {
                    var requests = create_sinon.requests(this);
                    editor.render();
                    create_sinon.respondWithJson(requests, {
                        html: mockXModuleEditorHtml,
                        "resources": []
                    });

                    expect(editor.$el.select('.xblock-header')).toBeTruthy();
                    expect(editor.getMode()).toEqual('settings');
                });
            });
        });
    });
