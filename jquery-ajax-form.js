var AjaxForm = new Class({
    options: {
        callback: function(){},
        context: null
    },
    form: null,
    action: null,
    processor: null,
    method: null,

    initialize: function (form, options) {
        jQuery.extend(true, {}, this.options, options);
        this.form = form;
        this.action = jQuery(this.form).attr('action');
        this.method = jQuery(this.form).attr('method');
        if (!this.action) {
            return;
        }

        this.processor = new JsonProcessor();

        var self = this;
        jQuery(this.form).submit(function(event) {
            self.submit(event);
        });
    },

    submit: function (event) {
        var self = this;
        event.preventDefault();
        $.ajax({
            url: this.action,
            type: this.method,
            context: this.options.context,
            data: jQuery(this.form).serialize(),
            error: function(xhr, type, exception) {
                this.self.error(xhr, type, exception)
            },
            success: function(data, status, xhr) {
                this.self.success(data, status, xhr)
            }
        }).done(function() {
            $( this ).addClass( "done" );
        });
    },

    error: function (xhr, type, exception) {
        this.processor.processJson(
            JSON.stringify(
                {
                    'message': type
                }
            )
        )
    },

    success: function (data, status, xhr) {
        if (this.options.context) {
            return;
        }
        this.processor.processJson(data);
    },
});