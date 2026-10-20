import Foundation
import CoreText
import CoreGraphics
let font = CTFontCreateWithName("Futura-Medium" as CFString, 120, nil)
let text = NSAttributedString(string: "SALVOR LABS", attributes: [NSAttributedString.Key(kCTFontAttributeName as String):font,NSAttributedString.Key(kCTKernAttributeName as String): 13])
let line = CTLineCreateWithAttributedString(text)
var paths:[CGPath] = []
var bounds = CGRect.null
for run in CTLineGetGlyphRuns(line) as! [CTRun] {
 let count = CTRunGetGlyphCount(run)
 var glyphs = [CGGlyph](repeating:0,count:count), positions = [CGPoint](repeating:.zero,count:count)
 CTRunGetGlyphs(run,CFRange(location:0,length:0),&glyphs)
 CTRunGetPositions(run,CFRange(location:0,length:0),&positions)
 for i in 0..<count {
  var t = CGAffineTransform(translationX:positions[i].x,y:positions[i].y)
  if let p = CTFontCreatePathForGlyph(font,glyphs[i],nil)?.copy(using:&t) {paths.append(p);bounds=bounds.union(p.boundingBoxOfPath)}
 }
}
var d=""
func n(_ x:CGFloat)->String {String(format:"%.4f",Double(x))}
for path in paths {
 path.applyWithBlock { ptr in
  let e=ptr.pointee,p=e.points
  switch e.type {
   case .moveToPoint:d += "M\(n(p[0].x)) \(n(p[0].y)) "
   case .addLineToPoint:d += "L\(n(p[0].x)) \(n(p[0].y)) "
   case .addQuadCurveToPoint:d += "Q\(n(p[0].x)) \(n(p[0].y)) \(n(p[1].x)) \(n(p[1].y)) "
   case .addCurveToPoint:d += "C\(n(p[0].x)) \(n(p[0].y)) \(n(p[1].x)) \(n(p[1].y)) \(n(p[2].x)) \(n(p[2].y)) "
   case .closeSubpath:d += "Z "
   @unknown default:break
  }
 }
}
let svg="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"\(n(bounds.width))\" height=\"\(n(bounds.height))\" viewBox=\"0 0 \(n(bounds.width)) \(n(bounds.height))\"><title>SALVOR LABS</title><desc>Futura Medium, optically clean geometric capitals with 13pt tracking at 120pt; exact native font outlines, no tracing.</desc><path fill=\"#ffffff\" transform=\"translate(\(n(-bounds.minX)) \(n(bounds.maxY))) scale(1 -1)\" d=\"\(d)\"/></svg>"
try svg.write(toFile:CommandLine.arguments[1],atomically:true,encoding:.utf8)
print("Font: \(CTFontCopyPostScriptName(font)); bounds: \(bounds)")
