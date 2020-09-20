
    function drawPagination() {

        // Assign null-able scope values from settings
        function setScopeValues(scope, attrs) {
            scope.List = [];
            scope.Hide = false;
            scope.page = parseInt(scope.page) || 1;
            scope.total = parseInt(scope.total) || 0;
            scope.dots = scope.dots || '...';
            scope.ulClass = 'pagination';
            scope.adjacent = parseInt(scope.adjacent) || 2;
            scope.activeClass = 'active';
            scope.disabledClass = 'disabled';

            scope.scrollTop = scope.$eval(attrs.scrollTop);
            scope.hideIfEmpty = scope.$eval(attrs.hideIfEmpty);
        }

        // Validate and clean up any scope values
        // This happens after we have set the
        // scope values
        function validateScopeValues(scope, pageCount) {
            // Block where the page is larger than the pageCount
            if (scope.page > pageCount) {
                scope.page = pageCount;
            }

            // Block where the page is less than 0
            if (scope.page <= 0) {
                scope.page = 1;
            }

            // Block where adjacent value is 0 or below
            if (scope.adjacent <= 0) {
                scope.adjacent = 2;
            }

            // Hide from page if we have 1 or less pages
            // if directed to hide empty
            if (pageCount <= 1) {
                scope.Hide = scope.hideIfEmpty;
            }
        }

        // Internal Pagination Click Action
        function internalAction(scope, page) {
            // Block clicks we try to load the active page
            if (scope.page == page) {
                return;
            }

            // Update the page in scope and fire any paging actions
            scope.page = page;
            scope.paginationAction({
                page: page
            });

            // If allowed scroll up to the top of the page
            if (scope.scrollTop) {
                scrollTo(0, 0);
            }
        }

        // Previous text
        function prev(scope, pageCount) {

            // Ignore if no page prev to display
            if(pageCount < 1) {
                return;
            }

            // Calculate the previous page and if the click actions are allowed
            // blocking and disabling where page <= 0
            var disabled = scope.page - 1 <= 0
            var prevPage = scope.page - 1 <= 0 ? 1 : scope.page - 1;

            var prev = {
                value: '<',
                liClass: disabled ? scope.disabledClass : '',
                action: function () {
                    if(!disabled) {
                        internalAction(scope, prevPage);
                    }
                }
            };

            scope.List.push(prev);
        }

        // Next text
        function next(scope, pageCount) {

            // Ignore if no page next to display
            if(pageCount < 1) {
                return;
            }

            // Calculate the next page number and if the click actions are allowed
            // blocking where page is >= pageCount
            var disabled = scope.page + 1 > pageCount;
            var nextPage = scope.page + 1 >= pageCount ? pageCount : scope.page + 1;

            var next = {
                value: '>',
                liClass: disabled ? scope.disabledClass : '',
                action: function () {
                    if(!disabled) {
                        internalAction(scope, nextPage);
                    }
                }
            };

            scope.List.push(next);
        }

        // Add Range of Numbers
        function addRange(start, finish, scope) {
            var i = 0;
            for (i = start; i <= finish; i++) {
                var item = {
                    value: i.toString(),
                    liClass: scope.page == i ? scope.activeClass : 'waves-effect',
                    action: function() {
                        internalAction(scope, this.value);
                    }
                };

                scope.List.push(item);
            }
        }

        // Add Dots ie: 1 2 [...] 10 11 12 [...] 56 57
        function addDots(scope) {
            scope.List.push({
                value: scope.dots
            });
        }

        // Add First Pages
        function addFirst(scope, next) {
            addRange(1, 2, scope);

            // We ignore dots if the next value is 3
            // ie: 1 2 [...] 3 4 5 becomes just 1 2 3 4 5
            if (next != 3) {
                addDots(scope);
            }
        }

        function addLast(pageCount, scope, prev) {
            // We ignore dots if the previous value is one less that our start range
            // ie: 1 2 3 4 [...] 5 6  becomes just 1 2 3 4 5 6
            if (prev != pageCount -2) {
                addDots(scope);
            }

            addRange(pageCount -1, pageCount, scope);
        }

        // Main build function
        function build(scope, attrs) {

            // Block divide by 0 and empty page size
            if (!scope.pageSize || scope.pageSize < 0)
            {
                return;
            }

            // Assign scope values
            setScopeValues(scope, attrs);

            // local variables
            var start,
                size = scope.adjacent * 2,
                pageCount = Math.ceil(scope.total / scope.pageSize);

            // Validation Scope
            validateScopeValues(scope, pageCount);

            prev(scope, pageCount);
            if (pageCount < (5 + size)) {

                start = 1;
                addRange(start, pageCount, scope);

            } else {

                var finish;

                if (scope.page <= (1 + size)) {

                    start = 1;
                    finish = 2 + size + (scope.adjacent - 1);

                    addRange(start, finish, scope);
                    addLast(pageCount, scope, finish);

                } else if (pageCount - size > scope.page && scope.page > size) {

                    start = scope.page - scope.adjacent;
                    finish = scope.page + scope.adjacent;

                    addFirst(scope, start);
                    addRange(start, finish, scope);
                    addLast(pageCount, scope, finish);

                } else {

                    start = pageCount - (1 + size + (scope.adjacent - 1));
                    finish = pageCount;

                    addFirst(scope, start);
                    addRange(start, finish, scope);

                }
            }
            next(scope, pageCount);
        }

        return {
            restrict: 'EA',
            scope: {
                page: '@',
                pageSize: '@',
                total: '@',
                dots: '@',
                hideIfEmpty: '@',
                adjacent: '@',
                scrollTop: '@',
                paginationAction: '&'
            },
            template:
                '<ul ng-hide="Hide" ng-class="ulClass"> ' +
                    '<li ' +
                    'ng-class="Item.liClass" ' +
                    'ng-click="Item.action()" ' +
                    'ng-repeat="Item in List"> ' +
                    '<a href> ' +
                    '<span ng-bind="Item.value"></span> ' +
                    '</a>' +
                '</ul>',
            link: function (scope, element, attrs) {

                // Hook in our watched items
                scope.$watchCollection('[page, total]', function () {
                    build(scope, attrs);
                });
            }
        };
    }
    
angular.module("ediCreatorApp")
    .directive('pagination', drawPagination);
