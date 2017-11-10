$( document ).ready(function() {
    'use strict';

    const TemplateEvents = {

        showInitScreen() {
            App.$container.html(App.$templateHelloScreen);
            App.doTextFit('#title');
            $('#buttonEvents span').text(App.events.length);
        },

        showAddEventScreen() {
            App.$container.html(App.$templateAddEventScreen);
            $(function () {
                $('#datetimepicker2').datetimepicker({
                    format: 'DD/MM/YYYY LT'
                });
            });

        },

        showEventsScreen() {
            App.$container.html(App.$templateShowEventsScreen);
        }
    }

    const App = {

        events: events,
        selectedEvent: {
            selectId: null,
            selectElem: null
        },

        init() {

            App.cacheElements();
            // App.cacheResources();
            // App.cacheProperty();
            // App.getEventsNum();

            TemplateEvents.showInitScreen();
            App.bindEvents();
        },

        cacheElements() {
            App.$doc = $(document);
            App.$container = $('#container');

            // Buttons
            App.buttonEvents = $('#buttonEvents');
            App.$buttonAdd = $('#buttonAdd');

            // Templates
            App.$templateHelloScreen = $('#hello-screen-template').html();
            App.$templateAddEventScreen = $('#addEvent-screen-template').html();
            App.$templateShowEventsScreen = $('#showEvents-screen-template').html();

        },

        bindEvents() {
            App.$doc.on('click', '#buttonEvents', App.showEvents);
            App.$doc.on('click', '#buttonAdd', TemplateEvents.showAddEventScreen);

            App.$doc.on('click', '.willButton', App.selectEvent);
            App.$doc.on('click', '#willButtonSave', App.saveWill);

            App.$doc.on('click', '#createEventButton', App.saveNewEvent);
            App.$doc.on('click', '#hrenVamButton', TemplateEvents.showInitScreen);

            App.$doc.on('click', '#backButton', TemplateEvents.showInitScreen);
        },

        showEvents() {
            if (App.events.length !== 0) {
                TemplateEvents.showEventsScreen();

                App.events.forEach(function(item, index){
                    // console.log(item);

                    let eventContainer = '';
                    eventContainer += '<tr id='+ item.idEvent +'>';
                    eventContainer += '<td>' + item.eventName + '</td>';
                    eventContainer += '<td>' + item.nameBos + '</td>';
                    eventContainer += '<td>' + item.eventPlace + '</td>';
                    eventContainer += '<td class="datetime">' + item.eventDateTime + '</td>';
                    eventContainer += '<td class="members">' + item.members + '</td>';
                    eventContainer += '<td><button type="button" class="btn btn-primary btn-md willButton" data-toggle="modal" data-target="#myModal">Буду!</button></td>';
                    eventContainer += '</tr>';

                    $('#eventsList').prepend(eventContainer);
                });

            }
        },

        saveNewEvent() {
            let data = {
                idEvent: App.getId(10),
                eventName: $('#example-partyName-input').val() || 'friendly party',
                nameBos: $('#example-nameBos-input').val() || 'какой-то парень',
                eventPlace: $('#example-place-input').val() || 'рыгаловка тры дубка',
                eventDateTime: $('#example-datetime-input').val() || 'когда-нибудь',
                members: ''
            };

            data.members += data.nameBos;
            App.events.push(data);

            $.ajax({
                type: "POST",
                url: "/createEvent",
                data: data,
                success: function(data){
                    console.log("Данные успешно записались!");
                   // location.reload();
                    TemplateEvents.showInitScreen();
                },
            });

        },

        selectEvent(){
            App.selectedEvent.selectElem = $(this).parent().parent();
            App.selectedEvent.selectId = $(this).parent().parent().attr("id");
        },

        saveWill() {
            if ( (App.selectedEvent.selectId !== 0) && (App.selectedEvent.selectElem !== 0)) {
                let newMember = $('#example-newMember-input').val() || 'какой-то парень';
                let members = App.selectedEvent.selectElem.children(".members").text();
                members = members + ', ' + newMember;
                App.selectedEvent.selectElem.children(".members").text(members);

                App.events.forEach(function(item, index) {
                    if ( item.idEvent === App.selectedEvent.selectId ) {
                        App.events[index].members = members;
                    }
                });

                $.ajax({
                    type: "POST",
                    url: "/addNewMember",
                    data: {
                        newMembers: members,
                        eventId: App.selectedEvent.selectId
                    },
                    success: function(data){
                        console.log("Вы идете! Вы дали слово, и оно уже в реестре! ");
                    },
                });
            }
        },

        getId(length) {
            const  chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");

            if (! length) {
                length = Math.floor(Math.random() * chars.length);
            }

            let str = "";
            for (let i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        },

        doTextFit: function(el) {
            textFit(
                $(el)[0], {
                    alignHoriz: true,
                    alignVert: false,
                    widthOnly: true,
                    reProcess: true,
                    maxFontSize: 300
                }
            );
        }

    }


    App.init();
});

