class LazyMotion
  constructor: (options)->
    @options =
      'attr': 'data-lazy'
      'el': 'html'
      'scollEvent': false
      'position': 'bottom'
      'offset': '100%'
      'motion': @addClass
      'reverse': @removeClass
      'cls': 'is-active'
      'beforeFn': ->
      'afterFn': ->
    $.extend(@options, options)

    @$el = $(@options.el).find('['+@options.attr+']')
    @attr = @options.attr
    @cls = @options.cls
    @windowHeight = $(window).height()
    @moving = false
    @init()

  init:->
    if @options.custom
      for key, fn of @options.custom
        @[key] = fn unless @[key]
    @setElems()
    @check $(window).scrollTop()
    if @options.scollEvent
      $(window).on 'scroll',=>
        scrollTop = $(window).scrollTop()
        @check scrollTop

    $(window).on 'resize',=>
      @windowHeight = $(window).height()
      @setBasePosition()

  setElems: ->
    @elems = []
    @$el.each (i, el)=>
      $el = $(el)
      attr = $el.attr @attr

      motionFn = @options.motion
      motionParam = @options.cls
      reverseFn = null
      reverseParam = @options.cls
      position = @options.position
      offset = $el.outerHeight(true) * parseInt(@options.offset) / 100

      if attr.indexOf('|') != -1
        attr = attr.split('|')[0]
        reverseFn = if attr.split('|')[1] then attr.split('|')[1] else @options.reverse

      if attr
        $.each attr.split(','), (i, opt)=>
          if opt.indexOf('top:') != -1 or opt.indexOf('center:') != -1 or opt.indexOf('bottom:') != -1
            position = opt.split(':')[0]
            offset = if opt.split(':')[1].indexOf('px') != -1 then parseInt(opt.split(':')[1]) else $el.outerHeight(true) * parseInt(opt.split(':')[1]) / 100
          else
            motionStr = opt
            if motionStr.indexOf(':') != -1
              motionFn = @[motionStr.split(':')[0]] if @[motionStr.split(':')[0]]
              motionParam = motionStr.split(':')[1]
            else
              if @[motionStr]
                motionFn = @[motionStr]
              else
                motionParam = motionStr
      @elems.push
        '$el' : $el
        'offset': offset
        'position': position
        'positionTop': $el.position().top
        'motion':
          'func': motionFn
          'param': motionParam
        'reverse':
          'func': reverseFn
          'param': reverseParam
        'moved': false
      @setBasePosition()

  setBasePosition: ->
    $.each @elems, (i, elem) =>
      elem.basePosition = switch elem.position
        when 'top' then 0 - elem.offset
        when 'center' then @windowHeight * 0.5 - elem.offset
        when 'bottom' then @windowHeight * 1 - elem.offset


  doMotion: ($el, motion)->
    if typeof motion == 'function'
      motion($el)
    else if motion.func
      motion.func($el, motion.param)

  check: (scrollTop)->
    $.each @elems, (i, elem) =>
      if scrollTop + elem.basePosition > elem.positionTop
        if !elem.moved
          elem.moved = true
          @doMotion elem.$el, elem.motion
      else if elem.reverse.func
        if elem.moved
          elem.moved = false
          @doMotion elem.$el, elem.reverse

  addClass: ($el, param)->
    $el.addClass param

  removeClass: ($el, param)->
    $el.removeClass param
