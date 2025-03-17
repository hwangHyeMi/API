package api.base.com.util;

import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;

public class MybatisUtils {

	/**
	 * 인자가 비어있는지 체크
	 * 
	 * @param obj
	 * @return
	 */
	public static Boolean isEmpty(Object obj) {
		if (obj instanceof String || obj instanceof Character)
			return obj == null || "".equals(obj.toString().trim());
		else if (obj instanceof Integer)
			return obj == null;
		else if (obj instanceof List)
			return obj == null || ((List<?>) obj).isEmpty();
		else if (obj instanceof Map)
			return obj == null || ((Map<?, ?>) obj).isEmpty();
		else if (obj instanceof Object[])
			return obj == null || Array.getLength(obj) == 0;
		else
			return obj == null;
	}

	/**
	 * 인자가 널인지 체크
	 * 
	 * @param obj
	 * @return
	 */
	public static Boolean isNull(Object obj) {
		if (obj instanceof String || obj instanceof Character)
			return obj == null;
		else if (obj instanceof Integer)
			return obj == null;
		else if (obj instanceof List)
			return obj == null;
		else if (obj instanceof Map)
			return obj == null;
		else if (obj instanceof Object[])
			return obj == null;
		else
			return obj == null;
	}

	/**
	 * 인자가 널이 아닌지 체크
	 * 
	 * @param obj
	 * @return
	 */
	public static Boolean isNotNull(Object obj) {
		return !isNull(obj);
	}

	/**
	 * 주어진 모든 인자가 비어있지 않는지 체크 한다.
	 * 
	 * @param objects
	 * @return
	 */
	public static Boolean isNotEmpty(Object... objects) {
		if (objects == null || objects.length == 0) {
			return false;
		}

		for (Object obj : objects) {
			if (isEmpty(obj)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 인자가 비어있지 않는지 체크
	 * 
	 * @param obj
	 * @return
	 */
	@Deprecated
	public static Boolean isNotEmpty(Object obj) {
		return !isEmpty(obj);
	}

	/**
	 * 두 인자가 일치하는지 체크
	 * 
	 * @param obj1
	 * @param obj2
	 * @return
	 */
	@SuppressWarnings({ "rawtypes" })
	public static Boolean isEquals(Object obj1, Object obj2) {
		if ((obj1 instanceof String || obj1 instanceof Character) && (obj2 instanceof String || obj2 instanceof Character))
			return obj1.equals(String.valueOf(obj2));
		else if (obj1 instanceof Integer && obj2 instanceof Integer) {
			return obj1.equals(obj2);
		} else if (obj1 == null || obj2 == null)
			return false;
		return false;
	}

	/**
	 * 두 인자가 일치하지 않는지 체크
	 * 
	 * @param obj1
	 * @param obj2
	 * @return
	 */
	public static Boolean isNotEquals(Object obj1, Object obj2) {
		return !isEquals(obj1, obj2);
	}

	/**
	 * obj1 배열에 obj2가 있는지 체크 <if test="@MybatisUtils@isNotContains({'MAN','WOMAN','V'}, 'V')"> // true
	 */
	public static Boolean isContains(Object obj1, Object obj2) {
		if (obj1 == null)
			return false;
		if (obj1 instanceof List) {
			for (int i = 0; i < ((List<?>) obj1).size(); i++) {
				if (isEquals(((List<?>) obj1).get(i), obj2))
					return true;
			}
		} else if (obj1 instanceof Object[]) {
			for (int i = 0; i < ((Object[]) obj1).length; i++) {
				if (isEquals(((Object[]) obj1)[i], obj2))
					return true;
			}
		}
		return false;
	}

	/**
	 * obj1 배열에 obj2가 없는지 체크 <if test="@MybatisUtils@isNotContains({'MAN','WOMAN','V'}, 'V')"> // false
	 */
	public static Boolean isNotContains(Object obj1, Object obj2) {
		return !isContains(obj1, obj2);
	}

}
