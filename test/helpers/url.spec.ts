import { buildUrl, isAbsoluteUrl, combineUrl, isUrlSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildUrl', () => {
    test('should support null params', () => {
      expect(buildUrl('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(
        buildUrl('/foo', {
          foo: 'bar'
        })
      ).toBe('/foo?foo=bar')
    })

    test('should ignore if some param value is null', () => {
      expect(
        buildUrl('/foo', {
          foo: 'bar',
          baz: null
        })
      ).toBe('/foo?foo=bar')
    })

    test('should ignore if the only param value is null', () => {
      expect(
        buildUrl('/foo', {
          baz: null
        })
      ).toBe('/foo')
    })

    test('should support object params', () => {
      expect(
        buildUrl('/foo', {
          foo: {
            bar: 'baz'
          }
        })
      ).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
    })

    test('should support date params', () => {
      const date = new Date()

      expect(
        buildUrl('/foo', {
          date: date
        })
      ).toBe('/foo?date=' + date.toISOString())
    })

    test('should support array params', () => {
      expect(
        buildUrl('/foo', {
          foo: ['bar', 'baz']
        })
      ).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    test('should support special char params', () => {
      expect(
        buildUrl('/foo', {
          foo: '@:$, '
        })
      ).toBe('/foo?foo=@:$,+')
    })

    test('should support existing params', () => {
      expect(
        buildUrl('/foo?foo=bar', {
          bar: 'baz'
        })
      ).toBe('/foo?foo=bar&bar=baz')
    })

    test('should correct discard url hash mark', () => {
      expect(
        buildUrl('/foo?foo=bar#hash', {
          query: 'baz'
        })
      ).toBe('/foo?foo=bar&query=baz')
    })

    test('should use serializer if provided', () => {
      // jest.fn 去模拟了一个函数
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(buildUrl('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(buildUrl('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })

  describe('isAbsoluteUrl', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteUrl('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteUrl('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteUrl('HTTP://example.com/')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteUrl('123://example.com/')).toBeFalsy()
      expect(isAbsoluteUrl('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteUrl('//example.com/')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteUrl('/foo')).toBeFalsy()
      expect(isAbsoluteUrl('foo')).toBeFalsy()
    })
  })

  describe('combineUrl', () => {
    test('should combine URL', () => {
      expect(combineUrl('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineUrl('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(combineUrl('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(combineUrl('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(combineUrl('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('isUrlSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isUrlSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isUrlSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})